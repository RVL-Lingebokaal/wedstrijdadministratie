import React, { useCallback, useEffect, useState } from 'react';
import { Page } from '../../components/atoms/page/page';
import { MainText } from '../../components/atoms/typography/text';
import { CustomCheckbox } from '../../components/atoms/checkbox/checkbox';
import { ScrollView } from 'react-native';
import { MultipleInputsContainer } from '../../components/atoms/containers/containers';
import { VolumeManager } from 'react-native-volume-manager';
import { timeService } from '../../services/timeService';
import { Snackbar } from '../../components/molecules/snackbar';
import { AntDesign } from '@expo/vector-icons';
import { Button } from '../../components/atoms/button/button';

export function Registration() {
  const [isStart, setIsStart] = useState(false);
  const [isA, setIsA] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const volumeChanger = useCallback(
    async (fromButton = false) => {
      const now = new Date();
      await timeService.saveTime(now.getTime(), isA, isStart);
      if (!fromButton) await VolumeManager.setVolume(0.8);
      setCurrentTime(now);
      setShowSnackbar(true);
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
      <ScrollView
        style={{ display: 'flex', gap: 20, opacity: showSnackbar ? 0.6 : 1 }}
      >
        <Snackbar
          message={
            <div style={{ display: 'flex', gap: '10px' }}>
              <AntDesign name="exclamationcircleo" size={24} color="red" />
              <MainText
                text={`De tijd ${getTimeString(currentTime)} is geregistreerd`}
              />
            </div>
          }
          visible={showSnackbar}
          onClose={() => setShowSnackbar(false)}
        />
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
        <MainText text="Je bent nu helemaal klaar om tijden te registreren. Om een tijd te registreren, druk op de volumeknop omhoog van je telefoon. Een andere optie is om de knop hieronder te gebruiken." />
        <Button
          title="Registreer tijd"
          color="primary"
          onPress={() => volumeChanger(true)}
        />
      </ScrollView>
    </Page>
  );
}

function getTimeString(date: Date) {
  const hour = date.getHours() > 10 ? date.getHours() : `0${date.getHours()}`;
  const minutes =
    date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`;
  const seconds =
    date.getSeconds() > 10 ? date.getSeconds() : `0${date.getSeconds()}`;
  return `${hour}:${minutes}:${seconds}`;
}
