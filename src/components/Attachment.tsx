import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { hp, wp } from '../utils/config';
import { TouchableOpacity } from 'react-native';
import prettyBytes from 'pretty-bytes';
import { useCloudinary } from '../utils';
import { useChatProvider } from '../context';
import { ActivityIndicator } from 'react-native';
import { theme } from '../utils/theme';

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

  const { response, progress, Uploading } = useCloudinary({
    file: attach,
    app_id: AppId,
    onUploaded,
  });

  console.log('Upload response', JSON.stringify(response, null, 3));
  console.log('Upload progress', JSON.stringify(progress, null, 3));
  console.log('Attachment $$$$$ ', JSON.stringify(attach, null, 3));

  const handleDelete = () => {
    !Uploading && onDelete(attach?.id);
  };
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
        <Text style={{ marginRight: wp(4) }}>{attach?.name}</Text>
        <Text style={{}}>{prettyBytes(attach?.size)}</Text>
      </Text>

      <TouchableOpacity onPress={handleDelete}>
        {Uploading ? (
          <ActivityIndicator size={'small'} color={theme?.SimpuBlack} />
        ) : (
          // <Text>{progress}</Text>
          <Image
            style={{ height: hp(18), width: hp(18) }}
            source={require('../assets/trashIcon.png')}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Attachment;
