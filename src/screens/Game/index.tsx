import { View, TouchableOpacity, Image, FlatList, Text } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Entypo } from '@expo/vector-icons'

import logoImg from '../../assets/logo-nlw-esports.png'
import { styles } from './styles'
import { GameParams } from '../../@types/navigation'
import { THEME } from '../../theme'

import { Heading } from '../../components/Heading'
import Background from '../../components/Background'
import { DuoCard } from '../../components/DuoCard'
import { DuoMatch } from '../../components/DuoMatch'

export interface DuoProps {
    hourEnd: string,
    hourStart: string,
    id: string,
    name: string,
    useVoiceChannel: boolean,
    weekDays: string[]
    yearsPlaying: number,
}

export function Game() {
    const [duos, setDuos] = useState<DuoProps[]>([])
    const [discordDuoSelected, setDiscordDuoSelected] = useState<string>('')

    const route = useRoute()

    const game = route.params as GameParams

    const navigation = useNavigation()

    function handleGoBack() {
        navigation.navigate('home')
    }

    async function getDiscordUser(adsId: string) {
        fetch(`http://192.168.15.4:3333/ads/${adsId}/discord`)
        .then(res => res.json())
        .then(data => setDiscordDuoSelected(data.discord))
    }

    useEffect(() => {
        fetch(`http://192.168.15.4:3333/games/${game.id}/ads`)
        .then(res => res.json())
        .then(data => setDuos(data))
    }, [])

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <Entypo 
                            name="chevron-thin-left"
                            color={THEME.COLORS.CAPTION_300}
                            size={20}
                        />
                    </TouchableOpacity>
                    <Image 
                        source={logoImg}
                        style={styles.logo}
                    />
                    <View style={styles.right} />
                </View>
                <Image
                    resizeMode='cover' 
                    style={styles.cover} 
                    source={{ uri: game.bannerUrl }}
                />
                <Heading 
                    title={game.title}
                    subtitle="Conecte-se e comece a jogar!"
                />
                <FlatList 
                    data={duos}
                    horizontal={true}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <DuoCard 
                            data={item}
                            onConnect={() => getDiscordUser(item.id)}
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                    style={styles.containerList}
                    contentContainerStyle={duos.length > 0 ? styles.contentList : styles.emptyListContent}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyListText}>Não há anúncios publicados ainda.</Text>
                    )}
                />

                <DuoMatch 
                    visible={discordDuoSelected.length > 0}
                    discord={discordDuoSelected}
                    onClose={() => setDiscordDuoSelected('')}
                />
            </SafeAreaView>
        </Background>
    )
}