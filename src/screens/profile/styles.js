import {StyleSheet} from 'pr-unit';
import {colors, metrics} from '../../assets/others';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: {
    flexGrow: 1,
  },

  contentProfile: {
    paddingHorizontal: metrics.small,
    backgroundColor: colors.grey300,
    paddingVertical: metrics.medium,
  },

  containerGrades: {
    flex: 1,
    paddingHorizontal: metrics.small,
    backgroundColor: 'white',
    paddingVertical: metrics.medium,
  },

  profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'red',
  },

  title: {
    flexDirection: 'row',
  },

  containerTagSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  tagSkill: {
    backgroundColor: colors.primary,
    // width: 'max-content',
    paddingHorizontal: metrics.small,
    paddingVertical: metrics.smaller * 0.8,
    alignSelf: 'flex-start',
    borderRadius: metrics.small * 0.5,
    marginRight: metrics.small * 0.5,
    marginBottom: metrics.small * 0.5,
  },

  textTagSkill: {
    fontSize: metrics.small * 1.8,
  },

  btnFollow: {
    backgroundColor: colors.primary + '80',
    // width: 'max-content',
    paddingHorizontal: metrics.medium,
    paddingVertical: metrics.smaller * 0.4,
    alignSelf: 'center',
    borderRadius: metrics.small * 0.5,
  },

  btnFollowText: {
    fontSize: metrics.small * 1.8,
  },

  containerFollowers: {
    flexDirection: 'row',
  },

  tagFollowers: {
    backgroundColor: colors.primary,
    // width: 'max-content',
    paddingHorizontal: metrics.small,
    paddingVertical: metrics.smaller * 0.8,
    alignSelf: 'flex-start',
    borderRadius: metrics.small * 0.5,
    opacity: 0.7,
  },

  textTagFollowers: {
    fontSize: metrics.small * 1.5,
  },

  imageProfile: {
    width: 350,
    height: 350,
    backgroundColor: colors.grey400,
    borderRadius: 250,
  },

  sessionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tagMedal: {
    backgroundColor: '#9A041340',
    // width: 'max-content',
    paddingHorizontal: metrics.small,
    paddingVertical: metrics.smaller * 0.8,
    alignSelf: 'flex-start',
    borderRadius: metrics.small * 0.7,
    // opacity: 0.5,
  },

  textTagMedal: {
    fontSize: metrics.small * 1.5,
  },

  containerSwitch: {
    flexDirection: 'row',
    alignSelf: 'center',
  },

  switchButton: {
    backgroundColor: '#BFC39E80',
    paddingHorizontal: metrics.big,
    paddingVertical: metrics.smaller,

    borderRadius: metrics.small * 0.9,
    width: '48%',
    alignItems: 'center',
  },

  textSwitchButton: {fontWeight: '700', fontSize: 44},

  optionFilter: {
    flexDirection: 'row',
    marginLeft: 60,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
});

export default styles;
