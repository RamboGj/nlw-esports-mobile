import { Image, FlatList } from "react-native"
import { useEffect, useState } from "react"
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

import logoImg from '../../assets/logo-nlw-esports.png'
import { GameCard, GameCardProps } from "../../components/GameCard"
import { Heading } from "../../components/Heading"

import { styles } from './styles'
import Background from "../../components/Background"

export function Home() {
    const [games, setGames] = useState<GameCardProps[]>([])

    const navigation = useNavigation()

    function handleOpenGame({ id, title, bannerUrl }: GameCardProps) {
        navigation.navigate('game', { id: id, title: title, bannerUrl: bannerUrl })
    }

    useEffect(() => {
        fetch('http://192.168.15.4:3333/games')
        .then(res => res.json())
        .then(data => setGames(data))
    }, [])

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <Image 
                    source={logoImg}
                    style={styles.logo}    
                />
                <Heading 
                    title="Encontre seu duo!"
                    subtitle="Selecione o game que deseja jogar..."
                />
                <FlatList
                    contentContainerStyle={styles.contentList}
                    data={games}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <GameCard 
                            onPress={() => handleOpenGame(item)} 
                            data={item} 
                        />
                        )
                    }
                    showsHorizontalScrollIndicator={false}
                    horizontal
                />
            </SafeAreaView>
        </Background>
    )
}