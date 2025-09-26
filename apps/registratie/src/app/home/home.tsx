import { View } from 'react-native';
import { Button } from '../../components/atoms/button/button';
import { NavigationProps } from '../interfaces';
import { Header, HeaderXL } from '../../components/atoms/typography/headings';
import { useState } from 'react';
import { Dropdown } from '../../components/atoms/dropdown/dropdown';

export function Home({ navigation }: NavigationProps<'home'>) {
  const [selectedWedstrijd, setSelectedWedstrijd] = useState<string>('');
  console.log(selectedWedstrijd);

  return (
    <View style={{ padding: 20, gap: 10, paddingTop: 40, flex: 1 }}>
      <HeaderXL text="RV Leerdam" type="primary" />
      <Header text="Tijdsregistratie" type="primary" />
      <View
        style={{
          flex: 1,
          gap: 30,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Dropdown
          options={[
            { label: 'Lingebokaal 2025', value: 'rvl25' },
            { label: 'Coupe des Jeunes 2025', value: 'cdj25' },
          ]}
          selectedValue={selectedWedstrijd}
          onValueChange={setSelectedWedstrijd}
          label="Selecteer wedstrijd"
        />
        <Button
          title="Registratie"
          color="white"
          onPress={() => navigation.navigate('registration')}
          disabled={!selectedWedstrijd}
        />
      </View>
    </View>
  );
}
