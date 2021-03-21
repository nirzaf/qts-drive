export interface HomepageContent {
    headerTitle: string;
    headerSubtitle: string;
    headerImage: string;
    headerImageOpacity: string;
    headerOverlayColor1: string;
    headerOverlayColor2: string;
    footerTitle: string;
    footerSubtitle: string;
    footerImage: string;
    actions: {
        cta1: string;
        cta2: string;
        cta3: string;
    };
    primaryFeatures: {
        title: string;
        subtitle: string;
        image: string;
    }[];
    secondaryFeatures: {
        title: string;
        subtitle: string;
        description: string;
        image: string;
    }[];
    channelIds: number[];
}
