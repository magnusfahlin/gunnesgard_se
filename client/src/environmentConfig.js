export function getApiRoot() {
    const port = process.env.PORT || 3001;
    const endpointRoot = process.env.SAME_ORIGIN
        ? ""
        : "http://localhost:" + port + "/";

    return endpointRoot;
}