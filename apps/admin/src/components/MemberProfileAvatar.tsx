import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AccountProfile, Keychain } from '@daohaus/utils';
import { Haus } from '@daohaus/moloch-v3-data';
import { MemberCard } from '@daohaus/ui';

import { fetchProfile } from '../utils/cacheProfile';

type MemberProfileProps = {
  memberAddress: string;
  daochain: keyof Keychain;
  daoid?: string;
};

const MemberContainer = styled.div`
  button {
    padding-left: 0 !important;
  }
`;

export const MemberProfileAvatar = ({
  memberAddress,
  daochain,
  daoid,
}: MemberProfileProps) => {
  const [memberProfile, setMemberProfile] = useState<AccountProfile>();
  const customProfileURI =
    daoid && `/molochv3/${daochain}/${daoid}/members/${memberAddress}`;

  const fetchMemberProfile = useCallback(
    async (address: string, setter: typeof setMemberProfile) => {
      const haus = Haus.create();
      const profile = await fetchProfile({ haus, address });
      setter(profile);
    },
    []
  );

  useEffect(() => {
    if (!memberProfile) {
      fetchMemberProfile(memberAddress, setMemberProfile);
    }
  }, [fetchMemberProfile, memberAddress, memberProfile, setMemberProfile]);

  return (
    <MemberContainer>
      <MemberCard
        explorerNetworkId={daochain}
        customProfileURI={customProfileURI}
        profile={
          memberProfile || {
            address: memberAddress,
          }
        }
      />
    </MemberContainer>
  );
};
