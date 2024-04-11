import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { hp } from '../utils/config';
import { TouchableOpacity } from 'react-native';
import prettyBytes from 'pretty-bytes';
import { useCloudinary } from '../utils';
import { useChatProvider } from '../context';

const Attachment = ({
  attach,
  onUploaded,
  onDelete,
}: {
  attach: object;
  onUploaded: () => {};
  onDelete: () => {};
}) => {
  const { AppId, userHash, sessionID } = useChatProvider();

  const { response } = useCloudinary({
    file: attach,
    app_id: AppId,
    onUploaded,
  });
  //   console.log('Attachment $$$$$ ', JSON.stringify(attach, null, 3));
  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: hp(7),
        borderRadius: hp(8),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: hp(15),
        marginVertical: hp(3),
      }}
    >
      <Text>
        {attach?.name} {prettyBytes(attach?.size)}
      </Text>

      <TouchableOpacity>
        <Image
          style={{ height: hp(18), width: hp(18) }}
          source={require('../assets/trashIcon.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Attachment;

const styles = StyleSheet.create({});
