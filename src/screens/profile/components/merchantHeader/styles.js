import {StyleSheet} from 'pr-unit';
import {colors, metrics} from '../../../../assets/others';

const styles = StyleSheet.create({
  contentProfile: {
    paddingHorizontal: metrics.small,
    backgroundColor: colors.grey300,
    paddingVertical: metrics.medium,
  },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  btnFollow: {
    backgroundColor: colors.primary + '80',
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
    width: 320,
    height: 320,
    backgroundColor: colors.grey400,
    borderRadius: 250,
  },

  sessionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pencilIcon: {
    width: 90,
    height: 90,
  },

  verifiedIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },

  verifyAlert: {
    backgroundColor: colors.orange,
    padding: metrics.small,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});

export default styles;
