import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import SimpuLiveChat from 'simpu-rn-livechat';

export default function App() {
  const [openLiveChat, setOpenliveChat] = useState(false);

  /*
  app_id: "e3e8ae1e",
  public_key: "spk__tTecSnzr7KAZtpaizeNmKxflgdmCF4JnPVoOMxKSGYiStSvTVA",
*/

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={() => setOpenliveChat(!openLiveChat)}
          style={{
            backgroundColor: '#4166F5',
            height: 40,
            width: 170,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>Talk to an agent</Text>
        </TouchableOpacity>
      </View>
      {openLiveChat && (
        <SimpuLiveChat
          app_id={'e3e8ae1e'}
          public_key={'spk__tTecSnzr7KAZtpaizeNmKxflgdmCF4JnPVoOMxKSGYiStSvTVA'}
        />
      )}
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
