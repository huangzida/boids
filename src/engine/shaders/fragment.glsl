#version 300 es
precision highp float;
in vec2 vUv;
in vec3 vColor;
out vec4 fragColor;

void main() {
  // Fill the shape with color, slight gradient based on UV
  float alpha = 0.8 + vUv.x * 0.2;
  fragColor = vec4(vColor, alpha);
}
