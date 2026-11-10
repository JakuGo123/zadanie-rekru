/* A continuous, 26-second light field. No video, GIF, library or texture. */
(() => {
  'use strict';
  const canvas = document.getElementById('light-canvas');
  const section = canvas.parentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, powerPreference: 'low-power' });
  if (!gl) { canvas.hidden = true; return; } // The CSS light field remains visible.

  const vertexSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;
  const fragmentSource = `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform float u_aspect;
    const float TAU = 6.28318530718;

    void main() {
      vec2 uv = v_uv;
      float phase = u_time * TAU / 26.0;
      float wave = sin(phase);
      float drift = cos(phase);
      float x = uv.x + 0.032 * sin(uv.y * 4.0 + phase);
      float slope = (0.45 + 0.055 * wave) / max(u_aspect / 2.3, 0.7);
      float diagonal = x + uv.y * slope;
      float lower = pow(1.0 - uv.y, 1.7);

      float ambient = exp(-pow((uv.x - 0.77 - 0.08 * drift) / 0.65, 2.0));
      float fold = 0.30 + 0.70 * pow(0.5 + 0.5 * sin(diagonal * 12.0 + wave * 0.65), 1.4);
      float broad = exp(-pow((diagonal - 1.03 - 0.065 * drift) / 0.30, 2.0));
      float ray = exp(-pow((diagonal - 0.27 - 0.04 * wave) / 0.032, 2.0));
      float shadow = exp(-pow((diagonal - 0.84 - 0.05 * drift) / 0.065, 2.0));

      float glow = lower * (0.32 * ambient + 0.65 * fold + 0.28 * broad);
      glow += ray * pow(1.0 - uv.y, 3.6) * 0.90;
      glow *= 1.0 - shadow * 0.82;
      glow *= smoothstep(0.05, 0.65, 1.0 - uv.y);

      vec3 dark = vec3(0.063, 0.063, 0.063);
      vec3 gold = vec3(0.78, 0.60, 0.09);
      vec3 color = mix(dark, gold, clamp(glow, 0.0, 1.0));
      color += vec3(0.20, 0.14, 0.0) * ray * lower * 0.25;
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  let program;
  let buffer;
  let timeUniform;
  let aspectUniform;
  let frameId = 0;
  let visible = false;
  let lost = false;
  let time = 0;
  let lastTime = null;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error('Shader compilation failed');
    }
    return shader;
  }

  function initialize() {
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Shader linking failed');
    gl.useProgram(program);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    timeUniform = gl.getUniformLocation(program, 'u_time');
    aspectUniform = gl.getUniformLocation(program, 'u_aspect');
    canvas.hidden = false;
    resize();
  }

  function draw() {
    if (lost || !program) return;
    gl.uniform1f(timeUniform, time);
    gl.uniform1f(aspectUniform, canvas.width / canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function resize() {
    if (lost) return;
    // Soft light needs no high-resolution framebuffer; cap GPU work on retina.
    const width = Math.max(1, Math.min(section.clientWidth, 1600));
    canvas.width = width;
    canvas.height = Math.max(1, Math.round(width * section.clientHeight / section.clientWidth));
    gl.viewport(0, 0, canvas.width, canvas.height);
    draw();
  }

  function tick(timestamp) {
    frameId = 0;
    if (lastTime !== null) time += Math.min(timestamp - lastTime, 100) / 1000;
    lastTime = timestamp;
    // Periodic sine/cosine makes the 26-second boundary mathematically seamless.
    time %= 26;
    draw();
    frameId = requestAnimationFrame(tick);
  }

  function sync() {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    lastTime = null;
    if (!lost && visible && !document.hidden && !reducedMotion.matches) frameId = requestAnimationFrame(tick);
    else draw();
  }

  try { initialize(); }
  catch (error) { canvas.hidden = true; return; }

  new ResizeObserver(resize).observe(section);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(section);
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    lost = true;
    canvas.hidden = true;
    sync();
  });
  canvas.addEventListener('webglcontextrestored', () => {
    lost = false;
    try { initialize(); sync(); }
    catch (error) { lost = true; canvas.hidden = true; }
  });
})();
