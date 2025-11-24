/**
 * @file Calculate packages which are not installed yet considering tree flattering.
 */

/**
 * @param {object} packages
 * @returns {string[]} packages at first level of tree
 */
function flatingPackages (packages) {
  return Object.entries(packages).reduce((flatPackages, [newKey, pkg]) => {
    const newName = pkg.name;
    let duplicated = false;
    for (const key of flatPackages) {
      const {name} = packages[key];
      if (name === newName) {
        duplicated = true;
        break;
      }
    }
    if (!duplicated) {
      flatPackages.push(newKey);
    }
    return flatPackages;
  }, []);
}

/**
 * @param {object} newPackages
 * @param {object} currentPackages
 * @returns {object}
 */
export default function calculateImpactPackages (newPackages, currentPackages) {
  const flatCurrentPackages = flatingPackages(currentPackages);
  return Object.entries(newPackages).filter(([key]) => {
    return !flatCurrentPackages.includes(key);
  }).reduce((impactPackages, [key, newPackage]) => {
    impactPackages[key] = newPackage;
    return impactPackages;
  }, {});
}
