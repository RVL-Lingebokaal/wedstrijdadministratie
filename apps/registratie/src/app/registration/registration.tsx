import { NavigationProps } from '../interfaces';
import React, { useEffect } from 'react';
import { Page } from '../../components/atoms/page/page';
import { MainText } from '../../components/atoms/typography/text';
import { CustomCheckbox } from '../../components/atoms/checkbox/checkbox';
import { View } from 'react-native';
import { MultipleInputsContainer } from '../../components/atoms/containers/containers';
import { VolumeManager } from 'react-native-volume-manager';
import { timeService } from '../../services/timeService';

export function Registration({ navigation }: NavigationProps<'registration'>) {
  const [isStart, setIsStart] = React.useState(false);
  const [isA, setIsA] = React.useState(false);
  const [time, setTime] = React.useState(0);

  useEffect(() => {
    void VolumeManager.showNativeVolumeUI({ enabled: false });
    const volumeListener = VolumeManager.addVolumeListener(() => {
      void timeService.saveTime(new Date().getTime(), isA, isStart);
      setTime(new Date().getTime());
      void VolumeManager.setVolume(0.5);
    });

    return function () {
      volumeListener.remove();
    };
  }, [time]);

  return (
    <Page title="Tijdsregistratie">
      <View style={{ display: 'flex', gap: 20 }}>
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
        <MainText text="Je bent nu helemaal klaar om tijden te registreren. Om een tijd te registreren, druk op de volumeknop van je telefoon. Het maakt hierbij niet uit of je het volume harder of zachter zet. In beide gevallen wordt er een tijd geregistreerd." />
        <MainText text={time.toString()} />
      </View>
    </Page>
  );
}
