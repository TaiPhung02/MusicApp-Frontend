import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import PlayPause from "./PlayPause";
import { playPause, setActiveSong } from "../../redux/features/playerSlice";
import { useGetTopTracksQuery } from "../../redux/services/shazamCore";

import "swiper/css";
import "swiper/css/free-mode";

const TopChartCard = ({
  song,
  i,
  isPlaying,
  activeSong,
  handlePauseClick,
  handlePlayClick,
}) => (
  <div className="w-full flex flex-row items-center hover:bg-[#4c426e] py-2 p-4 rounded-lg cursor-pointer mb-2">
    <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
    <div className="flex-1 flex flex-row justify-between items-center">
      <LazyLoadImage
        className="w-20 h-20 rounded-lg"
        src={song?.album?.cover_big}
        alt={song?.title}
        effect="blur"
      />

      <div className="flex-1 flex flex-col justify-center mx-3">
        <Link to={`/songs/${song?.id}`}>
          <p className="text-xl font-bold text-white">{song?.title}</p>
        </Link>

        <Link to={`artists/${song?.artist?.id}`}>
          <p className="hover:underline text-base text-gray-300 mt-1">
            {song?.artist?.name}
          </p>
        </Link>

        {/* <Link to={`/songs/${song?.id}`}>
          <p className="text-base text-gray-300 mt-1">{song?.artist?.name}</p>
        </Link> */}
      </div>
    </div>

    <PlayPause
      isPlaying={isPlaying}
      activeSong={activeSong}
      song={song}
      handlePause={handlePauseClick}
      handlePlay={handlePlayClick}
    />
  </div>
);

const TopPlay = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const [page, setPage] = useState(0);
  const limit = 20;

  const { data, isFetching, error } = useGetTopTracksQuery({
    limit,
    index: page * limit,
  });

  const divRef = useRef(null);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  const topPlays = data?.data?.slice(0, 3);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = ({ song, data, i }) => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  return (
    <div
      ref={divRef}
      className="xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[500px] max-w-full flex flex-col">
      <div className="w-full flex flex-col mt-4">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-white font-bold text-2xl">Top Artists</h2>
          <Link to="/top-artists">
            <p className="text-gray-300 text-base cursor-pointer">See more</p>
          </Link>
        </div>

        <Swiper
          slidesPerView="auto"
          spaceBetween={15}
          freeMode
          centeredSlides
          centeredSlidesBounds
          modules={[FreeMode]}
          className="mt-4">
          {topPlays?.map((song, i) => (
            <SwiperSlide
              key={song?.id}
              style={{ width: "25%", height: "auto" }}
              className="shadow-lg rounded-full animate-slideright">
              <Link
                to={`artist?/${song?.artist?.id}`}
                className="w-full h-full flex">
                <LazyLoadImage
                  src={song?.artist?.picture_big}
                  alt="name"
                  className="rounded-full w-full object-cover"
                  effect="blur"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="w-full flex flex-col mt-8">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-white font-bold text-2xl">Top Charts</h2>
          <Link to="/">
            <p className="text-gray-300 text-base cursor-pointer">See more</p>
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          {topPlays?.map((song, i) => (
            <TopChartCard
              key={song?.id}
              song={song}
              i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePauseClick={handlePauseClick}
              handlePlayClick={() => handlePlayClick({ song, data, i })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopPlay;
