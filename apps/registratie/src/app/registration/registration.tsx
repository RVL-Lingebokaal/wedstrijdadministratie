import React, { useCallback, useEffect, useState } from 'react';
import { Page } from '../../components/atoms/page/page';
import { LabelText, MainText } from '../../components/atoms/typography/text';
import { CustomCheckbox } from '../../components/atoms/checkbox/checkbox';
import { ScrollView, View } from 'react-native';
import { MultipleInputsContainer } from '../../components/atoms/containers/containers';
import { Button } from '../../components/atoms/button/button';
import { colors } from '../../theme/colors';
import { timeService } from '../../services/timeService';
import { VolumeManager } from 'react-native-volume-manager';

export function Registration() {
  const [isStart, setIsStart] = useState(false);
  const [isA, setIsA] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | undefined>(undefined);

  const volumeChanger = useCallback(
    async (fromButton = false) => {
      const now = new Date();
      await timeService.saveTime(now.getTime(), isA, isStart);
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
            text={
              currentTime
                ? `De tijd ${getTimeString(currentTime)} is geregistreerd`
                : 'Er is nog geen tijd geregistreerd'
            }
          />
        </View>
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

function getTimeString(date: Date) {
  const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
  const minutes =
    date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
  const seconds =
    date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;
  return `${hour}:${minutes}:${seconds}`;
}
