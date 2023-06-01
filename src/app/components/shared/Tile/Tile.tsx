import { tileClassName } from '@/app/consts/shared-classnames';
import { styleTileSets } from '@/app/consts/style-tile-sets';
import { classNames } from '@/app/utils';
import React, { ReactElement } from 'react';

interface Props {
  alternateWrapper?: {
    component: any;
    props?: any;
  };
  mainText: string;
  styledTileIdx: number;
  secondaryContent?: ReactElement;
  additionalTileClassName?: string;
  isActive?: boolean;
}

export default function Tile({
  mainText,
  styledTileIdx,
  secondaryContent,
  additionalTileClassName,
  alternateWrapper,
  isActive = true
}: Props): ReactElement {
  const mainClassName = classNames(
    'grid-row w-min-full flex flex-col justify-center items-center rounded-lg text-white',
    styleTileSets[styledTileIdx].background,
    isActive && tileClassName,
    additionalTileClassName
  );

  const Wrapper = alternateWrapper?.component;

  const renderContent = (): ReactElement => {
    return (
      <div className="relative w-full text-center">
        <h1 className={classNames('font-mogra text-3xl w-full', styleTileSets[styledTileIdx].text)}>{mainText}</h1>
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
  };

  return Wrapper ? (
    <Wrapper {...alternateWrapper?.props} className={mainClassName}>
      {renderContent()}
    </Wrapper>
  ) : (
    <div className={mainClassName}>{renderContent()}</div>
  );
}
