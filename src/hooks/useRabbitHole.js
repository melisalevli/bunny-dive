/* This hook manages the entire rabbit hole experience, including fetching topics, building the graph,
tracking visited topics, handling history, switching languages, and resetting the exploration. */

import { useState, useEffect, useRef } from 'react';
import { fetchWikipediaTopic, fetchLangLink } from '../services/wikipediaApi';
import { filterAndScoreLinks } from '../utils/scoring';
import { getLayoutedElements } from '../utils/dagreLayout';
import { TARGET_DEPTH } from '../utils/constants';

const edgeId = (source, target) => `${source}->${target}`;
export const useRabbitHole = (lang = 'en') => {
  const [visited, setVisited] = useState(new Set());
  const [history, setHistory] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [currentDetails, setCurrentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [translationToken, setTranslationToken] = useState(0);
  const frontierParent = useRef({});
  const snapshots = useRef({});
  const prevLangRef = useRef(lang);
  const takeSnapshot = (id, snap) => {
    snapshots.current[id] = {
      nodes: snap.nodes,
      edges: snap.edges,
      visited: new Set(snap.visited),
      history: [...snap.history],
      currentDetails: snap.currentDetails,
      frontierParent: { ...snap.frontierParent }
    };
  };

  const exploreTopic = async (title) => {
    if (loading) return;

    if (title !== currentNodeId && snapshots.current[title]) {
      const snap = snapshots.current[title];
      frontierParent.current = { ...snap.frontierParent };
      setVisited(new Set(snap.visited));
      setHistory([...snap.history]);
      setCurrentDetails(snap.currentDetails);
      setCurrentNodeId(title);
      setNodes(snap.nodes);
      setEdges(snap.edges);
      return;
    }

    setLoading(true);

    try {
      const data = await fetchWikipediaTopic(title, lang);
      const topLinks = filterAndScoreLinks(data.title, data.rawLinks, data.extract);
      const parentOfTitle = frontierParent.current[title];
      const isForward = currentNodeId === null || parentOfTitle === currentNodeId;

      let baseNodes = nodes;
      let baseEdges = edges;
      let baseVisited = visited;
      let baseHistory = history;

      if (!isForward) {
        const anchorSnap = snapshots.current[parentOfTitle];

        if (anchorSnap) {
          baseNodes = anchorSnap.nodes;
          baseEdges = anchorSnap.edges;
          baseVisited = new Set(anchorSnap.visited);
          baseHistory = [...anchorSnap.history];
          frontierParent.current = { ...anchorSnap.frontierParent };
        } else {
          const idsToClose = baseNodes
            .filter((n) => n.data.status === 'frontier' && n.id !== title)
            .map((n) => n.id);

          idsToClose.forEach((id) => delete frontierParent.current[id]);
          baseNodes = baseNodes.filter((n) => !idsToClose.includes(n.id));
        }
      }

      const newVisited = new Set(baseVisited).add(data.title);
      const newHistory = [...baseHistory, data.title];

      const updatedPrev = baseNodes.map((n) =>
        n.data.status === 'current' && n.id !== data.title
          ? { ...n, data: { ...n.data, status: 'visited' } }
          : n
      );

      const activeNode = {
        id: data.title,
        type: 'custom',
        data: { label: data.title, status: 'current' },
        position: { x: 0, y: 0 }
      };

      const newFrontierNodes = topLinks
        .filter((link) => !newVisited.has(link) && !updatedPrev.some((n) => n.id === link))
        .map((link) => {
          frontierParent.current[link] = data.title;
          return {
            id: link,
            type: 'custom',
            data: { label: link, status: 'frontier' },
            position: { x: 0, y: 0 }
          };
        });

      const combinedNodes = [
        ...updatedPrev.filter((n) => n.id !== data.title),
        activeNode,
        ...newFrontierNodes
      ];

      const nodeIds = new Set(combinedNodes.map((n) => n.id));

      const survivingEdges = baseEdges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));

      const freshEdges = newFrontierNodes.map((n) => ({
        id: edgeId(data.title, n.id),
        source: data.title,
        target: n.id,
        animated: true,
        style: { stroke: '#7067CF' }
      }));

      const dedupedEdges = Array.from(
        new Map([...survivingEdges, ...freshEdges].map((e) => [e.id, e])).values()
      );

      const layout = getLayoutedElements(combinedNodes, dedupedEdges);
      const newDetails = { ...data, connections: topLinks };

      setVisited(newVisited);
      setHistory(newHistory);
      setCurrentDetails(newDetails);
      setCurrentNodeId(data.title);
      setNodes(layout.nodes);
      setEdges(layout.edges);

      takeSnapshot(data.title, {
        nodes: layout.nodes,
        edges: layout.edges,
        visited: newVisited,
        history: newHistory,
        currentDetails: newDetails,
        frontierParent: frontierParent.current
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const prevLang = prevLangRef.current;
    prevLangRef.current = lang;

    if (prevLang === lang || !currentNodeId) return;
    let cancelled = false;
    const retranslate = async () => {
      setLoading(true);
      try {
        const idMap = {};

        await Promise.all(
          nodes
            .filter((n) => n.id !== currentNodeId)
            .map(async (n) => {
              const translated = await fetchLangLink(n.id, prevLang, lang);
              if (translated) idMap[n.id] = translated;
            })
        );

        const translatedCurrentTitle = (await fetchLangLink(currentNodeId, prevLang, lang)) || currentNodeId;
        const data = await fetchWikipediaTopic(translatedCurrentTitle, lang);
        const topLinks = filterAndScoreLinks(data.title, data.rawLinks, data.extract);

        idMap[currentNodeId] = data.title;

        if (cancelled) return;

        const renameId = (id) => idMap[id] || id;
        const renameNodesArr = (arr) =>
          arr.map((n) => {
            const newId = idMap[n.id];
            return newId ? { ...n, id: newId, data: { ...n.data, label: newId } } : n;
          });

        const renameEdgesArr = (arr) =>
          arr.map((e) => {
            const source = renameId(e.source);
            const target = renameId(e.target);
            return source === e.source && target === e.target
              ? e
              : { ...e, id: edgeId(source, target), source, target };
          });

        const renameSet = (set) => new Set(Array.from(set).map(renameId));
        const renameArr = (arr) => arr.map(renameId);
        const renameFrontierParentObj = (obj) =>
          Object.fromEntries(Object.entries(obj).map(([child, parent]) => [renameId(child), renameId(parent)]));

        const renamedNodes = renameNodesArr(nodes);
        const renamedEdges = renameEdgesArr(edges);
        const renamedVisited = renameSet(visited);
        const renamedHistory = renameArr(history);

        frontierParent.current = renameFrontierParentObj(frontierParent.current);

        const newDetails = { ...data, connections: topLinks };
        const layout = getLayoutedElements(renamedNodes, renamedEdges);

        setVisited(renamedVisited);
        setHistory(renamedHistory);
        setCurrentDetails(newDetails);
        setCurrentNodeId(data.title);
        setNodes(layout.nodes);
        setEdges(layout.edges);
        setTranslationToken((t) => t + 1);

        const nextSnapshots = {};

        Object.entries(snapshots.current).forEach(([key, snap]) => {
          const newKey = renameId(key);

          nextSnapshots[newKey] = {
            nodes: renameNodesArr(snap.nodes),
            edges: renameEdgesArr(snap.edges),
            visited: renameSet(snap.visited),
            history: renameArr(snap.history),
            currentDetails: newKey === data.title ? newDetails : snap.currentDetails,
            frontierParent: renameFrontierParentObj(snap.frontierParent)
          };
        });

        snapshots.current = nextSnapshots;
      } catch (err) {
        console.error('Translation on language switch failed:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    retranslate();

    return () => {
      cancelled = true;
    };
  }, [lang]);

  const reset = () => {
    setVisited(new Set());
    setHistory([]);
    setNodes([]);
    setEdges([]);
    setCurrentDetails(null);
    setCurrentNodeId(null);
    frontierParent.current = {};
    snapshots.current = {};
  };

  return {
    visited,
    history,
    nodes,
    edges,
    currentDetails,
    loading,
    exploreTopic,
    reset,
    translationToken,
    isComplete: visited.size >= TARGET_DEPTH
  };
};