# Définition des variables
$DOCKER_USERNAME = "timiliris"
$DOCKER_REPOSITORY = "blueprint"
$IMAGE_TAG = "latest"

# Build de l'image Docker sans cache
docker build --no-cache -t "$($DOCKER_USERNAME)/$($DOCKER_REPOSITORY):$IMAGE_TAG" .

# Tag de l'image
docker tag "$($DOCKER_USERNAME)/$($DOCKER_REPOSITORY):$IMAGE_TAG" "$($DOCKER_USERNAME)/$($DOCKER_REPOSITORY):$IMAGE_TAG"

# Push de l'image vers Docker Hub
docker push "$($DOCKER_USERNAME)/$($DOCKER_REPOSITORY):$IMAGE_TAG"
