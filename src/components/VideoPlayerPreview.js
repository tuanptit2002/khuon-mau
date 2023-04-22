/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from 'prop-types';
// @mui
import { Box, Button, Container, DialogActions, Typography } from '@mui/material';
// components
import FlagIcon from '@mui/icons-material/Flag';
import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import 'videojs-http-source-selector';
import 'videojs-youtube';
import { mediaBaseURL } from '../config';
import useLocales from '../hooks/useLocales';
import { DialogAnimate } from './animate';
// ----------------------------------------------------------------------

VideoPlayerPreview.propTypes = {
  video: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default function VideoPlayerPreview({ video, isOpen, onClose }) {
  const { translate } = useLocales();
  const type = "VIDEO";

  return (
    <DialogAnimate fullScreen open={isOpen} onClose={onClose}>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {translate("button.preview")}
        </Typography>
        <Button onClick={onClose}>{translate("button.close")}</Button>
      </DialogActions>
      <Container>
        <Box sx={{ mt: 5, mb: 10 }}>
          {type === 'VIDEO' && <PreviewVideo videoId={video?.id} />}
          {type === 'YOUTUBE' && <PreviewYoutube videoId={video?.id} />}
        </Box>
      </Container>
    </DialogAnimate>
  );
}

// ----------------------------------------------------------------------

function PreviewVideo({ videoId }) {
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
      const options =
      {
        playbackRates: [0.5, 1, 1.5, 2],
        fluid: true,
        fill: true,
        responsive: true,
        autoplay: true,
        plugins: {
          httpSourceSelector:
          {
            default: 'auto'
          }
        },
        html5: {
          vhs: {
            overrideNative: true,
          },
          nativeAudioTracks: false,
          nativeVideoTracks: false
        },
        sources: [{
          src: `${mediaBaseURL}/stream/video/${videoId}/index.m3u8`,
          type: 'application/x-mpegURL',
        }]
      };

      playerRef.current = videojs("video_1", options);
    } else {
      const player = playerRef.current;
      player.src({
        src: `${mediaBaseURL}/stream/video/${videoId}/index.m3u8`,
        type: 'application/x-mpegURL',
      });
    }
  }, [videoId]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <>
      <FlagIcon color='red' />
      <video id="video_1"
        poster={`${mediaBaseURL}/stream/video/${videoId}/thumbnail/thumb.jpg`}
        controls preload="metadata" autoPlay className="video-js vjs-default-skin vjs-16-9" />
    </>
  );
}


export function PreviewYoutube({ videoId }) {
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
      const options = {
        techOrder: ["youtube"],
        fluid: true,
        fill: true,
        responsive: true,
        posterImage: false,
        autoplay: true,
        sources: [{ "type": "video/youtube", "src": `https://www.youtube.com/watch?v=${videoId}` }],
      };

      playerRef.current = videojs('video_2', options);
    } else {
      const player = playerRef.current;
      player.src({ "type": "video/youtube", "src": `https://www.youtube.com/watch?v=${videoId}` });
    }
  }, [videoId]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <video id="video_2" className="video-js vjs-default-skin vjs-16-9" preload="metadata" controls autoPlay data-setup='{}' />
  );
}