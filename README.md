# Deconst Service Dockerfiles

*Hand-crafted artisanal Dockerfiles for non-core services*

This repository is home to the Dockerfiles for deconst services that aren't used for software written for deconst itself, but also don't have official Docker images in the Dockerhub registry.

## Curator

[![Docker Repository on Quay.io](https://quay.io/repository/deconst/curator/status "Docker Repository on Quay.io")](https://quay.io/repository/deconst/curator)

This image bundles [Elasticsearch Curator](https://www.elastic.co/guide/en/elasticsearch/client/curator/current/index.html) and some utility scripts to quickly prune old Elasticsearch indexes.
