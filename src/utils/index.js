function GetSceneBounds(camera, renderer) {
    if (!camera.fov || !camera?.position || !renderer) return null;

    // Convert FOV from degrees to radians
    const fovRad = (camera.fov * Math.PI) / 180;

    // Calculate the visible height at the given distance
    const visibleHeight = 2 * Math.tan(fovRad / 2) * camera.position.z;

    // Calculate the visible width using the aspect ratio
    const aspectRatio = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
    const visibleWidth = visibleHeight * aspectRatio;

    // Return the dimensions as an object
    return { width: visibleWidth, height: visibleHeight };
}

export {GetSceneBounds}