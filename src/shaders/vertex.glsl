

varying vec2 VUV;

void main(){
    VUV = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}