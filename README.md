# Simpu react-native livechat sdk

[![Twitter](https://img.shields.io/badge/twitter-@simpuinc-blue.svg?style=flat)](http://twitter.com/simpuinc)

[![GitHub license](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://www.simpu.co/legal/privacy-policy)

<!-- [![npm version](https://badge.fury.io/js/@pusher%2Fpusher-websocket-react-native.svg)](https://badge.fury.io/js/@pusher%2Fpusher-websocket-react-native) -->

For more information about [Simpu live chat](https://www.simpu.co/) visit the official simpu developer docs.

### Supported Mobile platforms

- Android
- iOS

### Deployment targets

due to third party libraries like pusher, this lbrary will only support:

- iOS 13.0 and above
- Android 7 and above. Android 6 will require [desugaring](https://developer.android.com/studio/write/java8-support#library-desugaring).

### Example Application

By cloning this repository you can check the React Native example application,
a minimal application, you can connect your app_id and public_key to test .

- https://github.com/simpu-inc/simpu-rn-livechat/tree/main/example

<!-- ![ScreenShort](./doc/IOS_image1.png) -->
### Image Preview

<div style="display: flex; justify-content: space-between;">
  <img src="./doc/IOS_image1.png" alt="Image 1" width="30%" />
  <img src="./doc/IOS_image3.png"" alt="Image 3" width="30%" />
  <img src="./doc/IOS_image2.png" alt="Image 2" width="30%" />
</div>


## Installation

```sh
npm install @simpu/simpu-rn-livechat
```

or

```sh
yarn add @simpu/simpu-rn-livechat
```

## Usage

```js
import SimpuLiveChat from '@simpu/simpu-rn-livechat';

// ...

const App = () => {
  return (
    <View>
      ... // place component anywhere around your App.jsx or App.tsx
      <SimpuLiveChat 
          app_id={"app id"}
          public_key={"publik key"}
      />
    </View>
  );
};
```

 ## Props

The complete set of **options** is described below:

| Props        | description                                                          | type                 | default value |
| ------------ | -------------------------------------------------------------------- | -------------------- | ------------- |
| `app_id`     | An eight character string, provided whern setting your live chat.    | `string`             | `''`          |
| `public_key` | An long character string, provided whern setting your live chat.text | `string`             | `''`          |
| `name`       | name of the logged in user                                           | `string`             |               |
| `email`      | email of the logged in user                                          | `string`             | `''`          |
| `phone`      | email of the logged in user                                          | `string`             | `''`          |
| `user_id`    | a unique id of the logged in user                                    | `string` or `number` | `""`          |


## Methods 

```js
import SimpuLiveChat from '@simpu/simpu-rn-livechat';



const Help = () => {

const handleOpenLiveChat = ()=>{
//call the live chat open method with or without parameters
SimpuLiveChat.open()
}


  return (
    <View>
      <TouchableOpacity onPress={handleOpenLiveChat}>
            <Text>Talk to an Agent</Text>
      </TouchableOpacity>
    </View>
  );
};
```

<!-- ## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow. -->

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
