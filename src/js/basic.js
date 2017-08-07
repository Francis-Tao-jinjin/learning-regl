var regl = require('regl')();

const draw = regl({
  frag: `
  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }`,

  vert: `
  attribute vec2 position;
  uniform float angle, scale, width, height;
  void main() {
    float aspect = width / height;
    // gl_Position = vec4(
    //   scale * (cos(angle) * position.x - sin(angle) * position.y),
    //   aspect * scale * (sin(angle) * position.x + cos(angle) * position.y),
    //   0,
    //   1.0 );
    // gl_Position = vec4(position, 0, 2);

    gl_Position = vec4(
      cos(angle) * position.x - sin(angle) * position.y,
      sin(angle) * position.x + cos(angle) * position.y,
      0, 2
    );
  }`,

  attributes: {
    position: [[0, -1], [-1, 0], [1, 1]]
  },

  // 类似 react 中的 props
  uniforms: {

    // batchId : index of the draw command in thee batch
    angle: function(context, props, batchId ) {
      // return props.speed * context.tick + 0.01 * batchId
      return context.tick * 0.01;
    },

    scale: regl.prop('scale'),

    width: regl.context('viewportWidth'),
    height: regl.context('viewportHeight'),
  },

  count: 3
});

regl.frame(function () {
  regl.clear({
    color: [0, 0, 0, 1]
  })

  // This tells regl to execute the command once for each object
  draw()
})



