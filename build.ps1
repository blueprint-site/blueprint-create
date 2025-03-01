# Variables
$DOCKER_USERNAME = "timiliris"
$DOCKER_REPOSITORY = "blueprint-coming-sooon"
$IMAGE_TAG = "latest"

# Build de l'image Docker
docker build -t "${DOCKER_USERNAME}/${DOCKER_REPOSITORY}:${IMAGE_TAG}" .

# Tag de l'image avec les informations Docker Hub
docker tag "${DOCKER_USERNAME}/${DOCKER_REPOSITORY}:${IMAGE_TAG}" "${DOCKER_USERNAME}/${DOCKER_REPOSITORY}:${IMAGE_TAG}"

# Push de l'image vers Docker Hub
docker push "${DOCKER_USERNAME}/${DOCKER_REPOSITORY}:${IMAGE_TAG}"

