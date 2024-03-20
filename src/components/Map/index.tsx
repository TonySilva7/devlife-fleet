import MapView, {
  MapViewProps,
  PROVIDER_GOOGLE,
  LatLng,
  Marker,
  Polyline,
} from 'react-native-maps'
import { IconBox } from '../IconBox'
import { Car, FlagCheckered } from 'phosphor-react-native'
import { useRef } from 'react'
import { useTheme } from 'styled-components/native'

type Props = MapViewProps & {
  coordinates: LatLng[]
}

export function Map({ coordinates, ...rest }: Props) {
  const lastCoordinate = coordinates[coordinates.length - 1]
  const mapRef = useRef<MapView>(null)
  const { COLORS } = useTheme()

  async function onMapLoaded() {
    if (coordinates.length > 1) {
      mapRef.current?.fitToSuppliedMarkers(['departure', 'arrival'], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      })
    }

    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    })
  }

  console.log('coordinates =====>> ', coordinates)

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{ width: '100%', height: 200 }}
      liteMode
      region={{
        latitude: lastCoordinate.latitude,
        longitude: lastCoordinate.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      onMapLoaded={onMapLoaded}
      {...rest}
    >
      <Marker identifier="departure" coordinate={coordinates[0]}>
        <IconBox size="SMALL" icon={Car} />
      </Marker>

      {coordinates.length > 1 && lastCoordinate && (
        <>
          <Marker identifier="arrival" coordinate={lastCoordinate}>
            <IconBox size="SMALL" icon={FlagCheckered} />
          </Marker>

          <Polyline
            coordinates={coordinates}
            strokeWidth={4}
            strokeColor={COLORS.GRAY_600}
          />
        </>
      )}
    </MapView>
  )
}
