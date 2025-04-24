// 将页面上的reaction序列化为可存储的格式
const serializerReaction = (reaction) => {
  const {
    whenTarget,
    whenState,
    whenValue,
    effectTarget,
    effectState,
    effectValue,
  } = reaction;
  const _reaction = {
    // dependencies: [whenTarget], TODO:支持被动依赖
    when: whenState ? `${whenState} == ${whenValue}` : "true",
    target: effectTarget,
    fulfill: {
      state: {
        [effectState]: effectValue,
      },
    },
    otherwise: {
      state: {
        [effectState]: effectValue,
      },
    },
  };
  return _reaction;
};

// 将存储的reaction反序列化为页面上的格式
const deserializerReaction = () => {};

export { serializerReaction, deserializerReaction };
