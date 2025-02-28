import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import SimpuLiveChat from 'simpu-rn-livechat';

export default function App() {


  /*
  app_id: "e3e8ae1e",
  public_key: "spk__tTecSnzr7KAZtpaizeNmKxflgdmCF4JnPVoOMxKSGYiStSvTVA",
*/

  // app_id: "e3e8ae1e",
  //       public_key: "spk__T4sfafLijwz09Po1ivc7g8NCGJBn67zclxG6wGINRn2LnnYCsS"




  return (
    <View style={styles.container}>
    
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <View
            style={{ marginTop: -40, marginBottom: 20, alignItems: 'center' }}
          >
            <Text style={{ fontSize: 18, paddingVertical: 10 }}>
              Welcome to my Waka Waka App
            </Text>
            <Text style={{ fontSize: 14 }}>
              We plane memorable trips for you and your Loved ones
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => SimpuLiveChat.open()}
            style={{
              backgroundColor: '#4166F5',
              height: 40,
              width: 170,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 18 }}>
              Talk to an agent
            </Text>
          </TouchableOpacity>
        </View>

{/* add live chat componet */}
        <SimpuLiveChat
          app_id={"54edf912"}
          public_key={"spk__AWecxUYSEhk7AyWIUpDhRY0c2JVD8saYTqlfZAqvi4Fh3xpQZH"}
        />
 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
