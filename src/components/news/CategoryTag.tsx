import Link from 'next/link';
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
  SealWarningIcon,
} from '@phosphor-icons/react/ssr';
import type { Icon } from '@phosphor-icons/react';
import { CATEGORIES, categoryHref, type CategoryColor, type CategoryId } from '@/lib/news/categories';

/* Swap any icon here: browse https://phosphoricons.com and import the
   same name + "Icon" from '@phosphor-icons/react/ssr'. */
export const CATEGORY_ICONS: Record<CategoryId, Icon> = {
  animals: RabbitIcon,
  people: UsersThreeIcon,
  science: TestTubeIcon,
  hope: SparkleIcon,
  tomorrow: GlobeHemisphereWestIcon,
  nature: FlowerLotusIcon,
  climate: LeafIcon,
  health: HeartbeatIcon,
  oceans: FishIcon,
  graphic: SealWarningIcon,
};

/**
 * Links to the category on /news, glowing in its colour on hover/focus (globals.css).
 * 'graphic' is a content warning: not a link, no hover/focus state.
 */
export default function CategoryTag({ id }: { id: CategoryId }) {
  const { label, color } = CATEGORIES[id];
  const IconComponent = CATEGORY_ICONS[id];
  const className = `category-tag inline-flex items-center gap-1 font-medium leading-5 text-[rgb(var(--cat))]`;
  const content = (
    <>
      <IconComponent aria-hidden="true" weight="regular" className="size-4 shrink-0" />
      {label}
    </>
  );

  if (id === 'graphic') {
    return (
      <span data-category={id} data-color={color} className={className}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={categoryHref(id)}
      data-category={id}
      data-color={color}
      className={`${className} transition-[filter] motion-reduce:transition-none`}
    >
      {content}
    </Link>
  );
}
