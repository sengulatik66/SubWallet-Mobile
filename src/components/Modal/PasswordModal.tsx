import { PasswordField } from 'components/Field/Password';
import { SubmitButton } from 'components/SubmitButton';
import { SubWalletModal } from 'components/SubWalletModal';
import useFormControl, { FormControlConfig, FormState } from 'hooks/screen/useFormControl';
import React, { useCallback } from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { validatePassword } from 'screens/Shared/AccountNamePasswordCreation';
import { ColorMap } from 'styles/color';
import { FontSemiBold, sharedStyles } from 'styles/sharedStyles';
import i18n from 'utils/i18n/i18n';

interface Props {
  visible: boolean;
  closeModal: () => void;
  onConfirm: (password: string) => void;
  isBusy: boolean;
  error: string;
  setError: (val: string) => void;
}

const ContainerStyle: StyleProp<ViewStyle> = {
  width: '100%',
};

const TitleTextStyle: StyleProp<TextStyle> = {
  ...sharedStyles.mediumText,
  ...FontSemiBold,
  textAlign: 'center',
  color: ColorMap.light,
  marginBottom: 24,
};

const ButtonStyle: StyleProp<ViewStyle> = {
  marginTop: 16,
};

const PasswordContainerStyle: StyleProp<ViewStyle> = {
  backgroundColor: ColorMap.dark1,
  borderRadius: 5,
  marginBottom: 8,
};

const formConfig: FormControlConfig = {
  password: {
    name: i18n.common.walletPassword,
    value: '',
    validateFunc: validatePassword,
    require: true,
  },
};

const PasswordModal = ({ closeModal, visible, onConfirm, isBusy, error, setError }: Props) => {
  const onSubmit = useCallback(
    (formState: FormState) => {
      const password = formState.data.password;

      onConfirm(password);
    },
    [onConfirm],
  );

  const { formState, onChangeValue, onSubmitField } = useFormControl(formConfig, { onSubmitForm: onSubmit });

  const handleChangePassword = useCallback(
    (val: string) => {
      setError('');
      onChangeValue('password')(val);
    },
    [onChangeValue, setError],
  );

  const onPress = useCallback(() => {
    const password = formState.data.password;
    onConfirm(password);
  }, [formState.data.password, onConfirm]);

  const errors = [...formState.errors.password, ...(error ? [error] : [])];

  return (
    <SubWalletModal modalVisible={visible} onChangeModalVisible={!isBusy ? closeModal : undefined}>
      <View style={ContainerStyle}>
        <Text style={TitleTextStyle}>{i18n.common.enterYourPassword}</Text>
        <PasswordField
          ref={formState.refs.password}
          label={formState.labels.password}
          defaultValue={formState.data.password}
          onChangeText={handleChangePassword}
          errorMessages={errors}
          onSubmitField={onSubmitField('password')}
          style={PasswordContainerStyle}
          isBusy={isBusy}
        />
        <SubmitButton
          title={i18n.common.confirm}
          style={ButtonStyle}
          isBusy={isBusy}
          onPress={onPress}
          disabled={!formState.data.password || formState.errors.password.length > 0}
        />
      </View>
    </SubWalletModal>
  );
};

export default React.memo(PasswordModal);