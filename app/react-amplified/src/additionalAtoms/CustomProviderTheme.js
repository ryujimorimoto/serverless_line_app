import LogoImg from "../assets/LINE_STEP_logo.png"
import LogoWideImg from "../assets/LINE_STEP_wide-logo.png"
export default function CustomProviderTheme() {
  return(
    {
      colors: {
        topBar: {
          background: '#e3e3ea',
        },
      },
      logo: {
        width: 180,
        topBarSource:
          LogoWideImg,
        contextualSaveBarSource:
          LogoImg,
        url: '/top',
        accessibilityLabel: 'LINE STEP',
      },
    }
  );
}