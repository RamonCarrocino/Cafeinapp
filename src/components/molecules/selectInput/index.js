import React, {useState} from 'react';
import {View} from 'react-native';
import {colors} from '../../../assets/others';

import {ArrowBottom} from '../../../assets/svg/icons';
import {Text, Touchable} from '../../atoms';
import ModalBase from '../modalBase';
import styles from './styles';

const SelectInput = ({
  value,
  options,
  placeholder,
  onChange,
  error,
  style,
  editable = true,
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleSelect = item => {
    setIsOpenModal(false);
    setTimeout(() => onChange(item.id, item), 300);
  };
  return (
    <>
      <Touchable
        style={[
          style || styles.optionSelect,
          !editable && {backgroundColor: colors.grey400},
        ]}
        onPress={() => setIsOpenModal(prev => editable && !prev)}>
        <Text style={value && {fontWeight: 'bold'}}>
          {value ? options.find(item => item.id === value).name : placeholder}
        </Text>
        <ArrowBottom />
      </Touchable>

      <ModalBase isVisible={isOpenModal} setIsVisible={setIsOpenModal}>
        {options.map((item, index) => (
          <View style={styles.containerItems}>
            <Touchable
              key={index.toString()}
              style={styles.itemSelect}
              onPress={() => handleSelect(item)}>
              <Text style={styles.labelSelect}>{item.name}</Text>
            </Touchable>
          </View>
        ))}
      </ModalBase>
      {error && (
        <Text style={styles.error} format="error">
          {error}
        </Text>
      )}
    </>
  );
};

export default React.memo(SelectInput);
