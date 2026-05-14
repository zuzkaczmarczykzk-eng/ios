import { StyleSheet } from 'react-native';

export const CARD_BG = 'rgba(255, 255, 255, 0.12)';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 130,
    paddingBottom: 36,
  },

  header: {
    color: '#FFFFFF',
    fontSize: 46,
    fontWeight: '400',
  },
  backBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    padding: 8,
  },
  backArrow: {
    color: '#fff',
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '200',
  },
  cityName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1.8,
  },

  mainIcon: {
    width: 96,
    height: 96,
    alignSelf: 'center',
    marginTop: 12,
  },
  temperature: {
    color: '#fff',
    fontSize: 86,
    fontWeight: '200',
    textAlign: 'center',
    lineHeight: 96,
    marginBottom: 24,
  },

  hourlyCard: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    paddingVertical: 10,
    marginBottom: 16,
  },
  hourlyScroll: {
    paddingHorizontal: 6,
  },
  hourlyItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 62,
  },
  hourlyItemActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  hourlyTime: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 5,
  },
  hourlyIcon: {
    width: 28,
    height: 28,
    marginBottom: 5,
  },
  hourlyTemp: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 16,
    width: '47.5%',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 15,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  statValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
  },
  hourlyItemSelected: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  weeklyBtn: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weeklyBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  weeklyBtnArrow: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '200',
    lineHeight: 32,
  },
});