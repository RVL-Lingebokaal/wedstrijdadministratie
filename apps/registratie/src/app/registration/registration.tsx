import React, { useCallback, useEffect, useState } from 'react';
import { Page } from '../../components/atoms/page/page';
import { LabelText, MainText } from '../../components/atoms/typography/text';
import { CustomCheckbox } from '../../components/atoms/checkbox/checkbox';
import { ScrollView, View } from 'react-native';
import { MultipleInputsContainer } from '../../components/atoms/containers/containers';
import { colors } from '../../theme/colors';
import { timeService } from '../../services/timeService';
import { VolumeManager } from 'react-native-volume-manager';
import ntpSync from '@ruanitto/react-native-ntp-sync';
import { Button } from '../../components/atoms/button/button';
import { RouteProp } from '@react-navigation/core';
import { RootStackParamList } from '../interfaces';

type RegistrationRouteProp = RouteProp<RootStackParamList, 'registration'>;

export function Registration({ route }: { route: RegistrationRouteProp }) {
  const clock = new ntpSync({});
  const [isStart, setIsStart] = useState(true);
  const [isA, setIsA] = useState(true);
  const [currentTime, setCurrentTime] = useState<number | undefined>(undefined);
  const { wedstrijdId } = route.params;

  const volumeChanger = useCallback(
    async (fromButton = false) => {
      const now = clock.getTime();
      await timeService.saveTime(now, isA, isStart, wedstrijdId);
      if (!fromButton) await VolumeManager.setVolume(0.5);
      setCurrentTime(now);
    },
    [isA, isStart]
  );

  useEffect(() => {
    void VolumeManager.showNativeVolumeUI({ enabled: false });
    const volumeListener = VolumeManager.addVolumeListener(() =>
      volumeChanger()
    );

    return function () {
      volumeListener.remove();
    };
  }, [isA, isStart]);

  return (
    <Page title="Tijdsregistratie">
      <ScrollView style={{ display: 'flex', gap: 20 }}>
        {currentTime && (
          <View
            style={{
              marginBottom: 10,
              borderWidth: 1,
              padding: 10,
              borderRadius: 4,
              borderStyle: 'dashed',
              borderColor: colors.primary,
              backgroundColor: colors.white,
            }}
          >
            <LabelText
              text={`De tijd ${getTimeString(currentTime)} is geregistreerd`}
            />
          </View>
        )}
        <MainText text="Geef hieronder aan of je bij de finish of de start staat." />
        <MultipleInputsContainer>
          <CustomCheckbox
            label="Finish"
            checked={!isStart}
            onChange={() => setIsStart(!isStart)}
          />
          <CustomCheckbox
            label="Start"
            checked={isStart}
            onChange={setIsStart}
          />
        </MultipleInputsContainer>
        <MainText text="Geef hieronder aan of je de tijd registreert voor A of voor B" />
        <MultipleInputsContainer>
          <CustomCheckbox label="A" checked={isA} onChange={setIsA} />
          <CustomCheckbox
            label="B"
            checked={!isA}
            onChange={() => setIsA(!isA)}
          />
        </MultipleInputsContainer>
        <MainText text="Je kan een tijd registreren door de volumeknop op de telefoon te gebruiken of de knop hieronder." />
        <View style={{ marginTop: 10 }}>
          <Button
            title="Registreer tijd"
            color="primary"
            onPress={() => volumeChanger(true)}
          />
        </View>
      </ScrollView>
    </Page>
  );
}

function getTimeString(date: number) {
  const dateObj = new Date(date);
  const hour =
    dateObj.getHours() >= 10 ? dateObj.getHours() : `0${dateObj.getHours()}`;
  const minutes =
    dateObj.getMinutes() >= 10
      ? dateObj.getMinutes()
      : `0${dateObj.getMinutes()}`;
  const seconds =
    dateObj.getSeconds() >= 10
      ? dateObj.getSeconds()
      : `0${dateObj.getSeconds()}`;
  return `${hour}:${minutes}:${seconds}`;
}
