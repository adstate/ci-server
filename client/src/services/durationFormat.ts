import humonizeDuration, {HumanizerOptions, humanizer} from 'humanize-duration';

const shortEngHumanizer = humanizer({
    language: 'shortEn',
    maxDecimalPoints: 1,
    languages: {
      shortEn: {
        h: () => 'h',
        m: () => 'min',
        s: () => 's'
      }
    },
    units: ['h', 'm']
});

const shortRusHumanizer = humanizer({
    language: 'shortRu',
    maxDecimalPoints: 1,
    languages: {
      shortRu: {
        h: () => 'ч',
        m: () => 'мин',
        s: () => 'с'
      }
    },
    units: ['h', 'm']
});

function durationFormat(duration: number | undefined, locale: string): string {
    if (!duration) return '-';

    return (locale === 'ru') ? shortRusHumanizer(duration) : shortEngHumanizer(duration);
}

export default durationFormat;