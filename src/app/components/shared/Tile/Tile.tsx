import { styleTileSets } from '@/app/consts/style-tile-sets';
import { classNames } from '@/app/utils';
import React, { Fragment, ReactElement, ReactNode } from 'react';

interface Props {
  alternateWrapper?: {
    component: any;
    props?: any;
  };
  mainText: ReactElement | string;
  styledTileIdx: number;
  secondaryContent?: ReactElement | string | undefined;
  additionalTileClassName?: string;
  hasAccent?: boolean;
  isActive?: boolean;
  isTwoLiner?: boolean;
}

export default function Tile({
  mainText,
  styledTileIdx,
  secondaryContent,
  additionalTileClassName,
  alternateWrapper,
  hasAccent = false,
  isActive = true,
  isTwoLiner = false
}: Props): ReactElement {
  const mainClassName = classNames(
    'grid-row w-min-full flex flex-col justify-center items-center rounded-lg text-white shadow-2xl',
    styleTileSets[styledTileIdx].background,
    isActive && 'sm:hover:brightness-110',
    'col-span-2',
    additionalTileClassName
  );

  const Wrapper = alternateWrapper?.component;

  const AccentWrapper = ({ children }: { children: ReactNode }): ReactElement => (
    <span
      className={classNames(
        `before:block before:absolute ${styleTileSets[styledTileIdx].accent} relative inline-block`,
        isTwoLiner && 'before:mt-9 before:h-[15%]'
      )}
    >
      {children}
    </span>
  );

  const ContentWrapper = hasAccent ? AccentWrapper : Fragment;

  const renderContent = (): ReactElement => (
    <div className="relative w-full text-center">
      <ContentWrapper>
        <h1
          className={classNames(
            'font-mogra text-3xl w-full relative white whitespace-break-spaces uppercase',
            styleTileSets[styledTileIdx].text
          )}
        >
          {mainText}
        </h1>
      </ContentWrapper>
      <span
        className={classNames(
          'absolute w-full left-0 right-0 m-auto text-violet-950',
          styleTileSets[styledTileIdx].text
        )}
      >
        {secondaryContent}
      </span>
    </div>
  );

  return Wrapper ? (
    <Wrapper {...alternateWrapper?.props} className={mainClassName}>
      {renderContent()}
    </Wrapper>
  ) : (
    <div className={mainClassName}>{renderContent()}</div>
  );
}
