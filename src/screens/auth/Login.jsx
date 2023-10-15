import { React, useState } from 'react';
import { ScrollView, View, useColorScheme } from 'react-native';
import {
  Text, Snackbar, MD3DarkTheme, MD3LightTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { differenceInMinutes } from 'date-fns';
import storage from '../../helpers/mmkv';
import LoginPasswordField from '../../components/LoginPasswordField';
import LoginUserIDField from '../../components/LoginUserIDField';
import LoginButton from '../../components/LoginButton';
import KIITlogo from '../../assets/KIIT_logo.svg';

export default function LoginScreen() {
  console.log(differenceInMinutes(new Date('2023-09-17T15:54:56.245Z'), new Date()));
  const [loadingState, updateLoadingState] = useState(false);
  const [disabledState, updateDisabledState] = useState(false);
  const [snackbarVisiblity, setSnackbarVisiblility] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const areAllFieldsFilled = (username !== '') && (password !== '');

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;
  const PrimaryRippleColor = isDarkMode ? '#00000080' : '#ffffff80';
  const SecondaryrippleColor = isDarkMode ? '#ffffff66' : '#00000066';

  function setFormDisabledState(state) {
    updateLoadingState(state);
    updateDisabledState(state);
  }

  const onDismissSnackBar = () => setSnackbarVisiblility(false);

  const onPressHandler = async () => {
    if (!areAllFieldsFilled) {
      setSnackbarMessage('Enter UserID and Password');
      setSnackbarVisiblility(true);
      return;
    }
    setSnackbarVisiblility(false);
    setFormDisabledState(true);
    const url = 'https://hj7xp13cu8.execute-api.ap-south-1.amazonaws.com/Prod/api/v1/cookie';

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      username,
      password,
    });

    const requestOptions = {
      method: 'POST',
      headers,
      body: raw,
      redirect: 'follow',
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      if (response.status === 401) setSnackbarMessage('Incorrect UserID / Password');
      setSnackbarVisiblility(true);
      setFormDisabledState(false);
    } else {
      const data = await response.json();
      storage.set('username', username);
      storage.set('password', password);
      storage.set('timestamp', String(new Date()));
      console.log(data);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <View style={{
          alignItems: 'center', paddingVertical: '5%',
        }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <KIITlogo width={72} height={72} />
            <View style={{ justifyContent: 'center' }}>
              <Text
                variant="displayMedium"
                style={{ color: '#17d059', fontWeight: 'bold' }}
              >
                KIITmate
              </Text>
            </View>
          </View>
          <Text
            variant="titleLarge"
            style={{
              color: theme.colors.secondary, textAlign: 'center', fontWeight: 'bold', marginBottom: 30,
            }}
          >
            Login to continue
          </Text>
          <View style={{ width: '85%', maxWidth: 500 }}>
            <LoginUserIDField
              disabled={disabledState}
              onChangeText={(newText) => setUsername(Number(newText))}
              style={{ marginBottom: 15 }}
            />
            <LoginPasswordField
              disabled={disabledState}
              onChangeText={(newText) => setPassword(newText)}
              rippleColor={SecondaryrippleColor}
              style={{ marginBottom: 25 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <LoginButton
                loading={loadingState}
                disabled={disabledState}
                rippleColor={PrimaryRippleColor}
                onPress={onPressHandler}
              />
            </View>
          </View>
        </View>
        <Snackbar
          visible={snackbarVisiblity}
          onDismiss={onDismissSnackBar}
          duration={2750}
        >
          {snackbarMessage}
        </Snackbar>
      </ScrollView>
    </SafeAreaView>
  );
}