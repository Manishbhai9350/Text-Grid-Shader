varying vec2 VUV;
uniform vec2 u_prevmouse;
uniform vec2 u_mouse;
uniform float u_aspect;
uniform float time;
uniform sampler2D u_texture;

void main() {
    vec2 vUv = VUV;

    // The Amount Of Grid Boxes
    const float Grids = 20.0;
    // Grid Cell In UV 
    vec2 gridCell = floor(vUv * Grids) / Grids;
    vec2 centerOfCell = gridCell + 1.0 / Grids;
    // Getting The Mouse Direction In Vectors
    vec2 mouseDirection = u_mouse - u_prevmouse;
    // Grid To Mouse Direction In Vectores
    vec2 cellToMouseDirection = centerOfCell - u_mouse;
    // Distance of mouse from each Grid
    float distanceFromMouse = length(cellToMouseDirection);
    // Strength Multiplier according to the Grid Distance From Mouse
    float strength = smoothstep(0.3, 0.0, distanceFromMouse);
    // Calculate the UV Offset based on the strength and mouse direction
    // The strength is multiplied by the mouse direction to make the movement more natural
    vec2 uvOffset = strength * (-mouseDirection) * 0.3;
    // Apply the UV offset to the current UV
    vec2 uv = vUv - uvOffset;

    vec4 color = texture2D(u_texture, uv);
    gl_FragColor = color; // Set the fragment color based on the texture with an offset
}