import {
  FishIcon,
  FlowerLotusIcon,
  GlobeHemisphereWestIcon,
  HeartbeatIcon,
  LeafIcon,
  RabbitIcon,
  SparkleIcon,
  TestTubeIcon,
  UsersThreeIcon,
  WarningIcon,
} from '@phosphor-icons/react/ssr';
import type { Icon } from '@phosphor-icons/react';
import { CATEGORIES, type CategoryColor, type CategoryId } from '@/lib/news/categories';

/* Swap any icon here: browse https://phosphoricons.com and import the
   same name + "Icon" from '@phosphor-icons/react/ssr'. */
const ICONS: Record<CategoryId, Icon> = {
  animals: RabbitIcon,
  people: UsersThreeIcon,
  science: TestTubeIcon,
  hope: SparkleIcon,
  tomorrow: GlobeHemisphereWestIcon,
  nature: FlowerLotusIcon,
  climate: LeafIcon,
  health: HeartbeatIcon,
  oceans: FishIcon,
  graphic: WarningIcon,
};

/* Full class names so Tailwind can see them (no string-building). */
const COLOR_CLASS: Record<CategoryColor, string> = {
  orange: 'text-category-orange',
  yellow: 'text-category-yellow',
  green: 'text-category-green',
  blue: 'text-category-blue',
  red: 'text-category-red',
};

/**
 * Bare on purpose: style with .category-tag, [data-category="…"] or [data-color="…"].
 * Not a link yet. When you add category pages, wrap it in <Link>.
 */
export default function CategoryTag({ id }: { id: CategoryId }) {
  const { label, color } = CATEGORIES[id];
  const IconComponent = ICONS[id];

  return (
    <span
      data-category={id}
      data-color={color}
      className={`category-tag inline-flex items-center gap-1 font-medium leading-5 ${COLOR_CLASS[color]}`}
    >
      <IconComponent aria-hidden="true" weight="regular" className="size-4 shrink-0" />
      {label}
    </span>
  );
}
