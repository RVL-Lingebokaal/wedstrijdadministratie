import { Text, View } from 'react-native';
import { Button } from '../../components/atoms/button/button';
import { NavigationProps } from '../interfaces';
import { Header, HeaderXL } from '../../components/atoms/typography/headings';
import { useEffect, useState } from 'react';
import { Dropdown } from '../../components/atoms/dropdown/dropdown';
import { wedstrijdService } from '../../services/wedstrijdService';

export function Home({ navigation }: NavigationProps<'home'>) {
  const [selectedWedstrijd, setSelectedWedstrijd] = useState<string>('');
  const [wedstrijden, setWedstrijden] = useState<
    { id: string; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchWedstrijden() {
      setIsLoading(true);

      wedstrijdService.getWedstrijden().then((data) => {
        setWedstrijden(data);
        setIsLoading(false);
      });
    }
    void fetchWedstrijden();
  }, []);

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
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Dropdown
              options={wedstrijden.map((wedstrijd) => ({
                label: wedstrijd.name,
                value: wedstrijd.id,
              }))}
              selectedValue={selectedWedstrijd}
              onValueChange={setSelectedWedstrijd}
              label="Selecteer wedstrijd"
            />
            <Button
              title="Registratie"
              color="white"
              onPress={() =>
                navigation.navigate('registration', {
                  wedstrijdId: selectedWedstrijd,
                })
              }
              disabled={!selectedWedstrijd}
            />
          </>
        )}
      </View>
    </View>
  );
}
