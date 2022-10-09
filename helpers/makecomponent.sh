# alias molecule='sh helpers/makecomponent.sh molecule $1'
# alias atom='sh helpers/makecomponent.sh atom $1'
# alias page='sh helpers/makecomponent.sh page $1'
# Run this from root of project and voilà
# $1 : "atom" | "molecule" | "page"
# $2 : string The name of the new component

if [ ! -d ./src/components/$1s ]; then
  echo "Not existing at all! Il faut tout faire soi-même dans cette maison !"
  mkdir ./src/components/$1s
  fi

cd ./src/components/$1s || exit
mkdir $2
cd $2 || exit


echo "
import React from \"react\"
import $2Display from \"./$2Display\"
export default function $2() {
  return (
    <$2Display></$2Display>
  )
}" >> $2.tsx


echo "
import React from \"react\";
import {Styled$2} from \"./styles\";
import {$2DisplayProps} from \"./types\";

export default function $2Display(props: $2DisplayProps) {
  return (
    <Styled$2>
      Styled$2 here
    </Styled$2>
  )
}
" >> $2Display.tsx
echo "
import styled from \"styled-components\";
export const Styled$2 = styled.div\`\`
" >> styles.ts

echo "
type $2Props = {

}
type $2DisplayProps = {

}

export type {$2DisplayProps, $2Props}
" >> types.ts

echo "Done. SUUUUPER"