import { View } from 'react-native';
import { Button } from '../../components/atoms/button/button';
import { NavigationProps } from '../interfaces';
import { Header, HeaderXL } from '../../components/atoms/typography/headings';

export function Home({ navigation }: NavigationProps<'home'>) {
  return (
    // <LinearGradient
    //   colors={['#0E294B', '#E5E5E5']}
    //   style={{ flex: 1, height: 'auto' }}
    //   locations={[0.5, 0.5]}
    //   start={{ x: 0.5, y: 0 }}
    //   end={{ x: 0.8, y: 0.5 }}
    // >
    <View style={{ padding: 20, gap: 10, paddingTop: 40, flex: 1 }}>
      <HeaderXL text="RV Leerdam Lingebokaal" type="primary" />
      <Header text="Tijdsregistratie" type="primary" />
      <View
        style={{
          flex: 1,
          gap: 30,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          title="Registratie"
          color="white"
          onPress={() => navigation.navigate('registration')}
        />
      </View>
    </View>
    // </LinearGradient>
  );
}
