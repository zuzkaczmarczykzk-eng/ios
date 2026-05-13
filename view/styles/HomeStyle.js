import { StyleSheet } from 'react-native';

const CARD_COLOR = 'rgba(255,255,255,0.10)';

const styles = StyleSheet.create({

    title: {
        color: '#FFFFFF',
        fontSize: 46,
        fontWeight: '400',
    },

    subtitle: {
        color: '#FFFFFF',
        fontSize: 20,
        marginBottom: 30,
        fontWeight: '400',
    },

    searchContainer: {
        height: 60,

        backgroundColor: '#FFFFFF',

        borderRadius: 40,

        paddingHorizontal: 18,

        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 30,

        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 8,
        },

        shadowOpacity: 0.25,
        shadowRadius: 10,

        elevation: 10,
    },

    input: {
        flex: 1,

        marginLeft: 10,

        fontSize: 18,

        color: '#000',

        fontWeight: '400',
    },

    background: {
        position: 'absolute',

        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    container: {
        flex: 1,
        paddingTop: 70,
        paddingHorizontal: 20,
    },
    card: {
        height: 110,
        borderRadius: 30,
        paddingHorizontal: 20,
        marginBottom: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        backgroundColor: 'rgba(255, 255, 255, 0.11)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.27)',

        elevation: 0,
        shadowOpacity: 0,

        overflow: 'hidden',
    },

    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    weatherIcon: {
        width: 60,
        height: 60,

        marginRight: 15,

        resizeMode: 'contain',
    },

    textContainer: {
    },

    city: {
        color: '#FFFFFF',

        fontSize: 24,

        fontWeight: '400',

    },

    countryRow: {
        flexDirection: 'row',

        alignItems: 'center',

        marginTop: 4,

    },

    locationIcon: {
        width: 12,
        height: 12,

        marginRight: 6,

        tintColor: '#FFFFFF',

        resizeMode: 'contain',

    },

    country: {
        color: '#FFFFFF',

        fontSize: 14,

        fontWeight: '400',

    },

    temp: {
        color: '#FFFFFF',

        fontSize: 44,

        fontWeight: '400',

    },
});

export default styles;