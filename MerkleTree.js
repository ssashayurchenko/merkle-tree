const hash = require("./hash");

class MerkleTree {
  constructor(leaves) {
    this.leaves = leaves.map(hash);
    this.tree = [this.leaves];
    this.buildTree();
  }

  buildTree() {
    let level = this.leaves;

    while (level.length > 1) {
      const nextLevel = [];

      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = level[i + 1] || level[i];

        const combinedHash = hash(left + right);
        nextLevel.push(combinedHash);
      }

      this.tree.unshift(nextLevel);
      level = nextLevel;
    }
  }

  getRoot() {
    return this.tree[0][0];
  }

  getProof(index) {
    let proof = [];
    let currentIndex = index;

    for (let level = this.tree.length - 1; level > 0; level--) {
      const levelNodes = this.tree[level];
      let siblingIndex = currentIndex ^ 1;

      if (siblingIndex >= levelNodes.length) {
        siblingIndex = currentIndex;
      }

      const siblingHash = levelNodes[siblingIndex];
      proof.push({
        hash: siblingHash,
        position: siblingIndex > currentIndex ? "right" : "left",
      });

      currentIndex = Math.floor(currentIndex / 2);
    }

    return proof;
  }

  static verifyProof(leaf, proof, root) {
    let computedHash = hash(leaf);

    for (const item of proof) {
      if (item.position === "left") {
        computedHash = hash(item.hash + computedHash);
      } else {
        computedHash = hash(computedHash + item.hash);
      }
    }

    return computedHash === root;
  }
}

module.exports = MerkleTree;
