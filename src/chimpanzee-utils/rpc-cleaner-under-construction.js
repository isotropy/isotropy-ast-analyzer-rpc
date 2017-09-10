const result = {
  collection: "postsAPI",
  object: {
    collection: "somethingelse",
    object: {
      collection: "something",
      identifier: "myServer",
      module: "todosServerModule"
    }
  }
};

// function identifyCollectionVariables(
//   currentLocation = result,
//   collectionArray = []
// ) {
//   let deepestKnownObject;
//   for (key in currentLocation) {
//     let deeperLevelExists = false;
//     if (key === "collection") collectionArray.push(currentLocation.collection);
//     if (key === "object") {
//       deeperLevelExists = true;
//       deepestKnownObject = currentLocation.object;
//     }
//     if (deeperLevelExists)
//       identifyCollectionVariables(currentLocation.object, collectionArray);
//   }
//   if (deepestKnownObject) {
//     delete deepestKnownObject.collection;
//     return { collectionArray, deepestKnownObject };
//   }
// }

function identifyCollectionVariables(
  currentLocation = result,
  collectionArray = [],
  deepestKnownObject = {}
) {
  let deeperLevelExists = false;
  for (key in currentLocation) {
    if (key === "collection") collectionArray.push(currentLocation.collection);
    if (key === "object") {
      deeperLevelExists = true;
      deepestKnownObject = currentLocation.object;
    }
  }
  if (deeperLevelExists)
    return identifyCollectionVariables(
      currentLocation.object,
      collectionArray,
      deepestKnownObject
    );
  return { collectionArray, deepestKnownObject };
}

function formRPCBody() {
  const { collectionArray, deepestKnownObject } = identifyCollectionVariables();
}

console.log(identifyCollectionVariables());
