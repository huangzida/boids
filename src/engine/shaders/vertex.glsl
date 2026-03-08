#version 300 es
in vec2 position;
in vec2 uv;
in vec4 instanceData; // x, y, angle, scale
in vec3 instanceColor;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 vUv;
out vec3 vColor;

void main() {
  vUv = uv;
  vColor = instanceColor;
  
  float angle = instanceData.z;
  float s = sin(angle);
  float c = cos(angle);
  mat2 rotation = mat2(c, s, -s, c);
  
  vec2 pos = rotation * (position * instanceData.w);
  pos += instanceData.xy;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 0.0, 1.0);
}
