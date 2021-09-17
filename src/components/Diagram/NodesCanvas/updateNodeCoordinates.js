/**
 * Given a node id, an pair of new coordinates and the nodes array, clones the nodes array and update the node
 * having that id with the new coordinates, then returns the cloned array.
 */
const updateNodeCoordinates = (nodeId, newCoordinates, nodes) => nodes.map((node) => {
  if (node.id === nodeId) {
    const { coordinates, ...rest } = node;
    return {
      ...rest,
      coordinates: newCoordinates,
    };
  }
  return node;
});

export default updateNodeCoordinates;
