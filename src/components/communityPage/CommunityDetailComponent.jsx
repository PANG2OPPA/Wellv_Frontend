import { Main } from "../../styles/Layouts";
import styled from "styled-components";
import Common from "../../utils/Common";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import CommunityAxiosApi from "../../api/CommunityAxios";
import { SmallButton } from "../../styles/styledComponents/StyledComponents";
import PostRoom from "./PostRoomComponent";
import MemberApi from "../../api/MemberApi";
import React from "react";
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const CategoryContent = styled.div`
  display: flex;
  color: #2446da;
  font-size: 1.5rem;
  font-weight: bold;
`;
const TitleContent = styled.div`
  display: flex;
  color: #2446da;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 5px;
  align-items: center;

  p {
    color: #333;
    font-size: 1rem;
  }
`;
const DetailInfoContent = styled.div`
  display: flex;
  color: #333;
  font-size: 0.8rem;
  justify-content: flex-end;
  margin-bottom: 5px;
  width: 100%;
  p {
    color: #2446da;
  }
`;
const PostListTitle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
`;
const Line = styled.div`
  width: 100%;
  height: 2px;
  margin-bottom: 10px;
  border-top: 1px solid #2446da;
`;
const Line2 = styled.div`
  width: 100%;
  height: 2px;
  margin-bottom: 10px;
  border-top: 2px solid #2446da;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;
  margin-bottom: 5px;
`;

const FormContainer = styled.div`
  display: flex;
  color: #333;
  justify-content: space-between;
  padding: 5px;
`;
const CenterFormContainer = styled.div`
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  min-height: 200px;
  max-height: 250px;
  border-bottom: 1px solid #c4c4c4;
  overflow-y: scroll;
  margin-bottom: 10px;
`;

const CommunityDetailComponent = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(""); // 좋아요 상태를 저장하는 상태
  const [post, setPost] = useState("");
  const [nickName, setNickName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const PostDetail = async () => {
      try {
        const memberDetail = await MemberApi.getMemberDetail();
        console.log(memberDetail.data);
        setNickName(memberDetail.data.nickName);
        // 게시물 정보 가져오기
        const postResponse = await CommunityAxiosApi.getCommunityDetail(id);
        setPost(postResponse.data);
        console.log(postResponse.data);
        like();
      } catch (error) {
        console.error("Error fetching post and comments:");
      }
    };
    PostDetail();
  }, [id]);

  const like = async () => {
    try {
      const response = await MemberApi.getMemberDetail();
      const email = response.data.email;
      // 좋아요 상태 확인하기
      const likeResponse = await CommunityAxiosApi.checkLikeStatus(id, email);
      setIsLiked(likeResponse.data);
      console.log(likeResponse.data);
    } catch (error) {
      console.error("Error like ", error);
    }
  };
  const likeIt = async () => {
    try {
      const response = await MemberApi.getMemberDetail();
      const email = response.data.email;
      // 좋아요 추가 또는 취소 요청 보내기
      let likeResponse;
      if (!isLiked) {
        likeResponse = await CommunityAxiosApi.likeIt(id, true, email); // 좋아요 취소
      } else {
        likeResponse = await CommunityAxiosApi.likeIt(id, false, email); // 좋아요 추가
      }
      // 좋아요 상태에 따라 알림 표시
      console.log(likeResponse.data);
      setIsLiked(likeResponse.data);
      if (isLiked === true) {
        alert("좋아요가 취소되었습니다.");
      } else if (isLiked === false) {
        alert("좋아요가 완료되었습니다.");
      }
      like();
    } catch (error) {
      console.error("Error likeIt ", error);
    }
  };

  // 수정 버튼 클릭 시 수정 모드로 전환
  const handleEdit = () => {
    navigate(`/communitypage/write/${post.communityId}`);
  };

  const deleteCommunity = async () => {
    try {
      const response = await CommunityAxiosApi.deleteCommunity(
        post.communityId
      );
      if (response.data === true) {
        console.log("게시물 삭제 성공");
        navigate("/communitypage");
      } else {
        console.log("게시물 삭제 실패");
        // 여기에 삭제 실패 시 수행할 작업을 추가합니다.
      }
    } catch (error) {
      console.error("게시물 삭제 오류:", error);
      // 여기에 오류 처리를 추가합니다.
    }
  };

  return (
    <Main>
      <InputContainer>
        <PostListTitle>
          <CategoryContent>{post.categoryName}</CategoryContent>
        </PostListTitle>
        <Line />
        <FormContainer>
          <TitleContent>
            TITLE<p>&nbsp;{post.title}</p>
          </TitleContent>
          <TitleContent>
            DATE
            <p>&nbsp;{Common.formatDate(post.regDate)}</p>
          </TitleContent>
        </FormContainer>
        <Line2 />
        <FormContainer>
          <DetailInfoContent>
            글쓴이 {post.nickName}, 좋아요
            <p>
              &nbsp;
              {isLiked ? (
                <FaHeart onClick={likeIt} />
              ) : (
                <FaRegHeart onClick={likeIt} />
              )}
              &nbsp;
            </p>
          </DetailInfoContent>
        </FormContainer>
        <CenterFormContainer
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></CenterFormContainer>
        <ButtonContainer>
          {post.nickName === nickName && (
            <>
              <SmallButton onClick={handleEdit}>수정</SmallButton>

              <SmallButton onClick={deleteCommunity}>삭제</SmallButton>
            </>
          )}
        </ButtonContainer>
        <PostRoom id={id} />
      </InputContainer>
    </Main>
  );
};
export default CommunityDetailComponent;
