import { NavigationProps } from '../interfaces';
import React from 'react';
import { Page } from '../../components/atoms/page/page';
// import { VolumeManager } from 'react-native-volume-manager';
import { MainText } from '../../components/atoms/typography/text';
import { CustomCheckbox } from '../../components/atoms/checkbox/checkbox';
import { View } from 'react-native';
import { MultipleInputsContainer } from '../../components/atoms/containers/containers';

export function Registration({ navigation }: NavigationProps<'registration'>) {
  const [isFinish, setIsFinish] = React.useState(false);
  const [isA, setIsA] = React.useState(false);
  const [time, setTime] = React.useState('');

  // useEffect(() => {
  //   void VolumeManager.showNativeVolumeUI({ enabled: false });
  //   const volumeListener = VolumeManager.addVolumeListener(() => {
  //     console.log('Volume button pressed');
  //     setTime(new Date().getTime());
  //   });
  //
  //   return function () {
  //     volumeListener.remove();
  //   };
  // }, []);

  return (
    <Page title="Tijdsregistratie">
      <View style={{ display: 'flex', gap: 20 }}>
        <MainText text="Geef hieronder aan of je bij de finish of de start staat." />
        <MultipleInputsContainer>
          <CustomCheckbox
            label="Finish"
            checked={isFinish}
            onChange={setIsFinish}
          />
          <CustomCheckbox
            label="Start"
            checked={!isFinish}
            onChange={() => setIsFinish(!isFinish)}
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
        <MainText text={time} />
      </View>
    </Page>
  );
}
