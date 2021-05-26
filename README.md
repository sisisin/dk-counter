# daken-counter

## setup

### backend/functions

```
yarn firebase functions:config:set twitter.consumer_key='your_key' twitter.consumer_secret='your_secret'
yarn firebase functions:config:get
```

# debugging

## electron app

### debugging auto update

ref.

- https://www.electron.build/auto-update#debugging
- https://github.com/electron-userland/electron-builder/issues/3053#issuecomment-401001573

```bash
# run minio

minio server ~/minio-data/

# publish to minio (on other process
electron-builder --config.publish.provider=s3 \
  --config.publish.endpoint=http://127.0.0.1:9000 \
  --config.publish.bucket=test-update
  --publish always
```
